# FusionBrain.AI API Wrapper

An API wrapper for FusionBrain.AI's image generator written for the Scriptable.app. 

You can generate your API keys on https://fusionbrain.ai/en/keys/.

Example usage:

```js
const prompt = 'a view of a person writing Javascript code'

const { FusionBrain } = importModule('fusion-brain-api')
const fb = new FusionBrain({
    key: 'your-api-key',
    secret: 'your-api-secret'
})

const models = await fb.getModels()
const model = models[0].id // only 1 model as of this writing

const images = await fb.generateImage({ prompt, model })
console.log(images)

//output ["/9j/4AAQSkZJRgABAQAAAQABAAD..."]

const actualImage = Image.fromData(Data.fromBase64String(images[0]))
await QuickLook.present(actualImage)

```

--- 

**Notice of Non-Affiliation and Disclaimer**

I am not affiliated, associated, authorized, endorsed by, or in any way officially connected to FusionBrain.ai or the AIRI Institute.

The names `Fusion Brain`,`FusionBrain.AI` as well as related names, marks, emblems and images are registered trademarks of their respective owners.