const { S3, GetObjectCommand } = require('@aws-sdk/client-s3')

module.exports = function(req, res) {
  const client = new S3()

  client.send(new GetObjectCommand({ Bucket: 'cupper-hj-test', Key: 'sample.png' }))
    .then(data => {
      res.attachment('download.png')
      data.Body.pipe(res)
    })
}
