import { ReactNode } from 'react'
import { Text, Heading, Card, CardHeader, CardBody, Box, BoxProps, Container } from '@verto/uikit'
import { GradientContainer } from 'components/shared/styled'
import FoldableText from './FoldableText'

interface Props extends BoxProps {
  header: string
  config: { title: string; description: ReactNode[] }[]
}

const SectionsWithFoldableText: React.FC<React.PropsWithChildren<Props>> = ({ header, config, ...props }) => {
  return (
    <Box maxWidth="888px" {...props}>
      <GradientContainer>
        <Card>
          <Container padding={['16px', '16px', '24px']}>
            <CardHeader>
              <Heading scale="lg" color="secondary">
                {header}
              </Heading>
            </CardHeader>
            <CardBody>
              {config.map(({ title, description }, i, { length }) => (
                <FoldableText key={title} id={title} mb={i + 1 === length ? '' : '16px'} title={title}>
                  {description.map((desc, index) => {
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <Text key={index} color="textSubtle" as="p">
                        {desc}
                      </Text>
                    )
                  })}
                </FoldableText>
              ))}
            </CardBody>
          </Container>
        </Card>
      </GradientContainer>
    </Box>
  )
}

export default SectionsWithFoldableText
