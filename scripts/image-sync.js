import { createClient } from '@supabase/supabase-js'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function getPhotoRefs() {
  const { data, error } = await supabase
    .from('places')
    .select('id, photo_ref')
    .is('image_url', null)
    .order('id', { ascending: true })

  if (error) {
    console.error(error)
    return
  }

  if (data.length === 0) {
    return
  }

  await createImages(data)
}

async function createImages(photoRefs) {
  try {
    const settled = await Promise.allSettled(photoRefs.map(processRow))

    const successes = settled
      .filter(response => response.status === 'fulfilled')
      .map(response => response.value)

    const updates = successes.map(({ id, url }) =>
      supabase
        .from('places')
        .update({ image_url: url, image_last_fetched: new Date().toISOString() })
        .eq('id', id)
        .throwOnError()
    )

    await Promise.all(updates)

    const failures = settled
      .filter(r => r.status !== 'fulfilled')
      .map(r => ({ id: r.reason.id, error: r.reason }))

    failures.forEach(f => {
      const message = f.error?.message ?? 'Unknown error'
      console.warn('Image failed', f.id, message)
    })
  } catch (err) {
    console.error(err)
    return false
  }
}

async function processRow({ id, photo_ref }) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    const maxWidth = 800
    const bucket = process.env.AWS_S3_BUCKET

    if (!bucket) throw new Error('AWS_S3_BUCKET environment variable is not defined')

    const region = process.env.AWS_REGION
    const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photo_ref}&key=${apiKey}`

    const response = await fetch(googlePhotoUrl)

    if (!response.ok) throw new Error(`Google ${response.status}`)

    const jpegBuffer = Buffer.from(await response.arrayBuffer())
    const webpBuffer = await sharp(jpegBuffer)
      .resize({ width: maxWidth })
      .webp({ quality: 80 })
      .toBuffer()

    const key = `places/${photo_ref}.webp`
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: webpBuffer,
        ContentType: 'image/webp',
        CacheControl: 'public,max-age=31536000,immutable',
      })
    )

    return { id, url }
  } catch (error) {
    const enhancedError = new Error(`Error processing id ${id}: ${error.message}`)
    enhancedError.id = id
    throw enhancedError
  }
}

getPhotoRefs()
  .then(() => console.log('Got refs'))
  .catch(err => console.error(`Failed to get refs: ${err}`))
