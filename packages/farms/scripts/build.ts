/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import path from 'path'
import fs from 'fs'
import farm1111 from '../constants/1111'
import farm3333 from '../constants/3333'

import lpHelpers1111 from '../constants/priceHelperLps/1111'
import lpHelpers3333 from '../constants/priceHelperLps/3333'

const chains = [
  [1111, farm1111, lpHelpers1111],
  [3333, farm3333, lpHelpers3333],
]

export const saveList = async () => {
  console.info('save farm config...')
  try {
    fs.mkdirSync(`${path.resolve()}/lists`)
    fs.mkdirSync(`${path.resolve()}/lists/priceHelperLps`)
  } catch (error) {
    //
  }
  for (const [chain, farm, lpHelper] of chains) {
    console.info('Starting build farm config', chain)
    const farmListPath = `${path.resolve()}/lists/${chain}.json`
    const stringifiedList = JSON.stringify(farm, null, 2)
    fs.writeFileSync(farmListPath, stringifiedList)
    console.info('Farm list saved to ', farmListPath)
    const lpPriceHelperListPath = `${path.resolve()}/lists/priceHelperLps/${chain}.json`
    const stringifiedHelperList = JSON.stringify(lpHelper, null, 2)
    fs.writeFileSync(lpPriceHelperListPath, stringifiedHelperList)
    console.info('Lp list saved to ', lpPriceHelperListPath)
  }
}

saveList()
