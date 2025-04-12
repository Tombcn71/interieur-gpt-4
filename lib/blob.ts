import { put } from "@vercel/blob"
import { nanoid } from "nanoid"

export async function uploadImage(file: File) {
  const filename = `${nanoid()}-${file.name}`
  const { url } = await put(filename, file, {
    access: "public",
  })

  return url
}
