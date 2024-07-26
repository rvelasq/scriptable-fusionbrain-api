// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: brain;

/*
File: fusionbrain-ai-api.js
Desc: Basic API wrapper for fusionbrain.ai
      image generator for Scriptable.app.
      Generate API keys on 
        https://fusionbrain.ai/en/keys/
Author: rvelasq (https://github.com/rvelasq)
Website: https://github.com/rvelasq/scriptable-fusionbrain-api
*/

class FusionBrain {
  #API_URL;
  #API_KEY;
  #API_SECRET;

  constructor({
    key,
    secret,
    endpoint = 'https://api-key.fusionbrain.ai'
  }) {
    this.#API_KEY = key
    this.#API_SECRET = secret
    this.#API_URL = endpoint
  }

  #newFusionBrainRequest(url) {
    const req = new Request(url)
    req.headers = {
      "X-Key": `Key ${this.#API_KEY}`,
      "X-Secret": `Secret ${this.#API_SECRET}`
    }
    return req
  }

  async getModels() {
    console.log('getting models')
    const url = `${this.#API_URL}/key/api/v1/models`
    const req = this.#newFusionBrainRequest(url)
    return (await req.loadJSON())
  }

  async generateImage({
    prompt,
    model,
    images = 1,
    width = 512,
    height = 512,
    pollInterval = 3, pollAttempts = 10
  } = {}) {

    if (typeof model == 'undefined') {
      throw 'generateImage: parameter `model` is required.'
    }
    if (typeof prompt == 'undefined') {
      throw 'generateImage: parameter `prompt` is required.'
    }

    console.log(`sending prompt - ${prompt}`)
    const url = `${this.#API_URL}/key/api/v1/text2image/run`

    const req = this.#newFusionBrainRequest(url)
    req.method = "POST"

    Object.apply(req.headers, {
      "Content-Type": "multipart/form-data",
    })

    const params = JSON.stringify({
      type: "GENERATE",
      numImages: images,
      width,
      height,
      generateParams: {
        query: prompt
      }
    })
    console.log(params)

    req.addFileDataToMultipart(
      Data.fromString(params),
      "application/json",
      "params",
      "params.json")

    req.addParameterToMultipart("model_id", `${model}`)

    const genReq = await req.loadJSON()
    if (!genReq?.uuid) {
      console.log(`failed - ${genReq.message}`)
      return
    }

    const sleep = function (ms) {
      return new Promise((resolve, reject) => {
        const t = new Timer()
        t.timeInterval = ms
        t.schedule(() => {
          t.invalidate()
          resolve()
        })
      })
    }

    console.log(`submit and poll for response`)
    const statusUrl = `${this.#API_URL}/key/api/v1/text2image/status/${genReq.uuid}`
    const statusReq = this.#newFusionBrainRequest(statusUrl)
    let resp;
    while (true) {
      if (pollAttempts > 0) {
        resp = (await statusReq.loadJSON())
        console.log(`progress = ${resp?.status ?? 'unknown'}`)
        if (["DONE", "FAIL"].includes(resp['status'])) {
          break
        }
        pollAttempts = pollAttempts - 1
        await sleep(pollInterval * 1000)
      } else {
        break
      }
    }
    if (pollAttempts == 0) {
      console.warn('poll attempts exhausted')
    }

    if (resp?.images?.length) {
      return resp.images
    }

    return
  }
}

module.exports = { FusionBrain }