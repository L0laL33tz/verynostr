const crypto = require("crypto");
const {verify, sign, getPublicKey} = require("@noble/secp256k1");

const PRIVKEY = "81cbdb9c82bcb6067ca96ca0e754bb3d3efd1b813281010e392256c642de1064"
const PUBKEY = "8a5a685420091ae0abef79be1735921b6bab047cc5b2aaefb8f8902dedf117f5"

const PUBKEY_TO_SIGN = "d209e16fadb854d893e286f7b880ddd43e3b8dea44611dad4e0c24d6329f26cf";

const command = process.argv[2];

if( !command || process.argv.length !== 5 ) {
  console.log("node signKey sign <private key> <public key to sign>");
  console.log("         or");
  console.log("node signKey verify <signature> <signed public key>");
  process.exit(1);
}

( async () => {
  if( command === 'sign' ) {
    if (process.argv.length !== 5) {
      console.log("node signKey sign <private key> <public key to sign>");
      process.exit(1);
    }
    const privkey = process.argv[3];
    const pubkey = Buffer.from( getPublicKey(privkey) ).toString('hex');
    const pubkeyToSign = process.argv[4];

    const hash = await crypto.createHash('sha256').update(pubkeyToSign).digest('hex');
    const sig = Buffer.from( await sign(hash, privkey)).toString('hex');
    console.log( sig+"."+pubkey );


  } else if( command === 'verify' ) {
    if (process.argv.length !== 5) {
      console.log("node signKey verify <signature> <signed public key>");
      process.exit(1);
    }
    const signatureSignerPubkeyStr = process.argv[3];
    const signedPubkey = process.argv[4];

    const hash = await crypto.createHash('sha256').update(signedPubkey).digest('hex');
    const signatureSignerPubkey = signatureSignerPubkeyStr.split('.');
    if( await verify(signatureSignerPubkey[0], hash, signatureSignerPubkey[1]) ) {
      console.log( "Signature is valid");
    } else {
      console.log( "Signature is not valid");
    }
  }
})()

