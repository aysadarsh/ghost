const { z } = require('zod')


// playlist
const songSchema = z.object({
    _id:z.string()
})
 const playlistSchema = z.object({
    name:z.string().min(1,"Name required!"),
    media:z.array(songSchema)
});


module.exports = playlistSchema
