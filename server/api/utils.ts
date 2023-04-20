import formidable from "formidable"

export const parseForm = (req: any) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: true })

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ files, fields })
    })
  })
