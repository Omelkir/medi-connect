// src/pages/api/vision-pdf.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { Storage } from '@google-cloud/storage'
import vision from '@google-cloud/vision'

export async function GET(req: NextRequest) {
  try {
    const bucketName = 'vision-api-user2'
    const fileName = 'test.pdf' // اسم الملف في الـ Bucket

    // 1. تهيئة الـ clients
    const storage = new Storage({
      keyFilename: './credential/vision-pdf.json'
    })

    const client = new vision.v1.ImageAnnotatorClient({
      keyFilename: './credential/vision-pdf.json'
    })

    // 2. نعمل request لتحليل PDF في GCS باستخدام Document Text Detection
    const inputConfig = {
      gcsSource: { uri: `gs://${bucketName}/${fileName}` },
      mimeType: 'application/pdf'
    }

    const outputConfig = {
      gcsDestination: { uri: `gs://${bucketName}/output/` },
      batchSize: 2 // يمكن تغييرها حسب حجم الملف
    }

    const request: any = {
      inputConfig,
      features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
      outputConfig
    }

    // 3. نرسل الطلب كـ async batch request (long-running operation)
    const [operation]: any = await client.asyncBatchAnnotateFiles({ requests: [request] })

    // 4. نستنى انتهاء العملية
    const [filesResponse] = await operation.promise()

    // 5. نقرا الملف الناتج (الـ JSON) من GCS output folder
    const [files] = await storage.bucket(bucketName).getFiles({ prefix: 'output/' })
    let fullText = ''

    for (const file of files) {
      const contents = await file.download()
      const json = JSON.parse(contents.toString())

      // json.responses -> extract text blocks
      json.responses.forEach((resp: any) => {
        if (resp.fullTextAnnotation) {
          fullText += resp.fullTextAnnotation.text + '\n'
        }
      })
    }

    return NextResponse.json({ text: fullText })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
