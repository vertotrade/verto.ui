/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import path from 'path'
import fs from 'fs'
import farm1011 from '../constants/1011'
import farm3033 from '../constants/3033'
import farm3034 from '../constants/3034'
import farm9696 from '../constants/9696'

import lpHelpers1011 from '../constants/priceHelperLps/1011'
import lpHelpers3033 from '../constants/priceHelperLps/3033'
import lpHelpers3034 from '../constants/priceHelperLps/3034'
import lpHelpers9696 from '../constants/priceHelperLps/9696'


const chains = [
  [1011, farm1011, lpHelpers1011],
  [3033, farm3033, lpHelpers3033],
  [3034, farm3034, lpHelpers3034],
  [9696, farm9696, lpHelpers9696],
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
