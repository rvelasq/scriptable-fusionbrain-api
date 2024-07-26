// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: magic;

/*
File: fusionbrain-ai-widget.js
Desc: Example widget that uses fusionbrain.ai to
      generate a widget background
Author: rvelasq (https://github.com/rvelasq)
Website: https://github.com/rvelasq/scriptable-fusionbrain-api
*/

// generate API keys on https://fusionbrain.ai/en/keys/
const API_KEY = 'your-api-key'
const API_SECRET = 'your-api-secret'

async function generateImage(prompt) {
  const { FusionBrain } = importModule('fusionbrain-ai-api')
  const fb = new FusionBrain({
    key: API_KEY,
    secret: API_SECRET
  })

  const models = await fb.getModels()
  const model = models[0].id // there's only one model for now

  const images = await fb.generateImage({ prompt, model })

  if (images) {
    return Image.fromData(Data.fromBase64String(images[0]))
  }

}

const widget = new ListWidget

if (!args.widgetParameter) {
  widget.addSpacer()
  widget.addText('Please input your prompt on the widget parameter')
  widget.addSpacer()
} else {
  widget.backgroundImage = await generateImage(`${args.widgetParameter}`)
}

Script.setWidget(widget)
if (config.runsInApp) {
  await widget.presentLarge()
}

