const crypto = require("crypto");
const {verify, sign, getPublicKey} = require("@noble/secp256k1");

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

