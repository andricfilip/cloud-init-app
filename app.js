const express = require('express')
const app = express()

app.use(express.static(__dirname + '/web'))

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/web/index.html');
})

const port = 2058;
app.listen(port, function() {
    console.log('server listening on port ' + port)
})