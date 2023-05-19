const fs = require('fs')
const crypto = require('crypto')

const algorithm = 'aes-256-ctr'
let key = 'MySecretKey'
key= crypto.createHash('sha256').update(String(key)).digest('base64').substring(0,32)


// Encrypt Function
const encrypt = (buffer)=>{
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()])

    return result
}   


// Decrypt Function
const decrypt = (encrypted)=>{
    // Get the vector: The first 16  bytes
    const iv = encrypted.slice(0,16)

    //Get the rest
    encrypted = encrypted.slice(16)

    // Create Decipher
    const decipher = crypto.createDecipheriv(algorithm, key, iv)

    // Decrypt file 
    const result = Buffer.concat([decipher.update(encrypted), decipher.final()])


    return result;
}



// Reading the file
fs.readFile('./myFile.txt', (err,file)=>{
    if(err) return console.log(err.message)

    const encryptedFile = encrypt(file);

    // write encrypted text in other file

    fs.writeFile('./Encrypted_myFile.txt', encryptedFile, (err,file)=>{
        if(err) return console.log(err.message)
        if(file) return console.log('Wrote encrypted text to new file')
    })
})


fs.readFile('./Encrypted_myFile.txt', (err,file)=>{
    if(err) return console.log(err.message)
    if(file){
        const decryptedFile = decrypt(file)
        console.log(decryptedFile.toString())
    }
})