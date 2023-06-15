import { useEffect, useState } from 'react'
import { Flex, FlexProps } from '@verto/uikit'
import random from 'lodash/random'
import uniqueId from 'lodash/uniqueId'
import { useTheme } from '@verto/hooks'
import { parseRetrievedNumber } from '../helpers'
import { BallWithNumber } from '../svgs'

interface WinningNumbersProps extends FlexProps {
  number: string
  size?: string
  fontSize?: string
  rotateText?: boolean
}

const WinningNumbers: React.FC<React.PropsWithChildren<WinningNumbersProps>> = ({
  number,
  size = '32px',
  fontSize = '16px',
  rotateText,
  ...containerProps
}) => {
  const { isDark } = useTheme()
  const [rotationValues, setRotationValues] = useState([])
  const reversedNumber = parseRetrievedNumber(number)
  const numAsArray = reversedNumber.split('')

  useEffect(() => {
    if (rotateText && numAsArray && rotationValues.length === 0) {
      setRotationValues(numAsArray.map(() => random(-30, 30)))
    }
  }, [rotateText, numAsArray, rotationValues])

  return (
    <Flex justifyContent="space-between" {...containerProps}>
      {numAsArray.map((num, index) => {
        return (
          <BallWithNumber
            key={uniqueId()}
            rotationTransform={rotateText && rotationValues[index]}
            size={size}
            fontSize={fontSize}
            isDark={isDark}
            number={num}
          />
        )
      })}
    </Flex>
  )
}

export default WinningNumbers
