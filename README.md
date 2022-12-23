# verynostr
## Nostr profile verification scheme

Impersonation is an issue in all forms of social media profiles. Because Nostr is based on Public/Private key cryptography we can apply the concept of [key signing parties](https://en.wikipedia.org/wiki/Key_signing_party) to increase trust in Nostr profiles.  

This scheme is highly theoretical and would likely require [improvements on protocol level](https://github.com/nostr-protocol/nips) as no central key server exists. One idea would be to add signatures to metadata, but only key owners are able to update their own metadata. Meaning: when a user's public key is signed they must receive the signature directly through the signee and add the signature manually to their pubkey's metadata for the signature to be called via `REQ, kinds:(0)`. 

Ideally signatures would be updated directly via their own event type, s.a. `REQ, kinds:(69), '#p' : [public_key]`. 

## Motivation

[NIP05](https://github.com/nostr-protocol/nips/blob/master/05.md) is awesome but we see the issue that domains are a plenty and easy to impersonate. For example, anyone may buy the domain uxerik.io, uxerik.net, uxerik.org, etc if these domains have not previously been secured by the legitimate uxerik. Verification via DNS identifiers therefore only makes sense for extremely well-known domains. 

While uxerik is our friend, we dont know what his legitimate domain is (sorry Erik). Therefore we would need to look up uxerik's legitimate domain by either asking him personally or navigating to one of his trusted social profiles to check whether his domain is listed there. This issue is negated by enabling the signing of Nostr public keys as anyone looking at a Nostr profile can see who has signed the public key in question.

## How It Works 

By signing other people's public keys we essentially establish a [web of trust](https://en.wikipedia.org/wiki/Web_of_trust). To sign someone's public key a trusted communication channel is needed prior to signing, such as Telegram or Twitter, where we can be sure that the person who is handing us our keys is indeed the person they are claiming to be.

Scenario 01: uxerik sends me his public key via telegram chat and I send him mine. I know that this is the legitimate uxerik's telegram account because we've coordinated IRL meetups via the account. I sign uxerik's public key with my private key and uxerik signs my public key with his private key. Because you now know that I know uxerik and can see that I've signed his public key, your trust in uxerik's public key being the legitimate uxerik goes up and vice versa. Additionally one can navigate to other trusted channels of communication – for example, you could check whether the key I signed uxerik's public key with is the same key listed on my website or in my Twitter profile. 

Scenario 02: I know NVK's legitimate public key because he posted it on his Twitter profile and I know that the Twitter profile I obtained the key from is the legitimate NVK. NVK then signs Jack's public key. Because I trust that NVK would only sign a public key he's personally verified my trust in Jack's public key belonging to the legitimate Jack goes up, and so on and so forth. 

Checking the legitimacy of pub keys via trusted channels should be done via NIP05 as well and therefore adds no overhead to the verification process. However, it can alleviate the necessity of verifying via other communication channels through the web of trust aspect. If the calling of signatures is enabled on protocol level signatures can be displayed in the front end, such as so:


<img width="726" alt="Screenshot 2022-12-23" src="https://user-images.githubusercontent.com/54821950/209402694-edafc1b0-6cbb-4a1d-91f0-e20dca77042d.png">


## Signing Nostr Public Keys

Install [Node Version Manager](https://github.com/nvm-sh/nvm)

Download & unzip nostrKeySign from this repository

Navigate into the repository, likely via `cd Downloads/nostrKeySign`

Run `npm ci` 

Run `node signKey.js`

Run `node signKey sign <your private key> <public key to be signed>`

The script returns a signature which (for now) needs to be shared with the person whose public key was signed directly to upload it to Nostr metadata and can then be called with `REQ, kind:(0)`.


## Verifying Signatures

Signatures can be verified manually via `node signKey verify <signature> <signed public key>`. If support is added on protocol level signatures can be displayed in the front end for manual verification but could also be verified by clients directly. 


<img width="683" alt="Screenshot 2022-12-23 at 21 53 07" src="https://user-images.githubusercontent.com/54821950/209404838-7a1ffc22-8822-49ac-8b69-9493f42d1469.png">


## Notes

There's probably a lot better ways to add public key signing schemes to Nostr if desired. Nobody working on this idea is a cryptographer so please take this proposal with a grain of salt. Contributions are very welcome. 

Muchos Gracias to froggo the frog for doing all the hard work.


