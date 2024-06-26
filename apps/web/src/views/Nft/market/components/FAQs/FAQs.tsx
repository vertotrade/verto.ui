import { ReactNode } from 'react'
import { Text, Heading, Card, CardBody, Box, BoxProps, Container, Flex } from '@verto/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import FoldableFAQs from './FoldableFAQs'

interface Props extends BoxProps {
  config: {
    header: string
    description: string
    questions: { title: string; description: ReactNode[] }[]
  }
}

const FAQs: React.FC<Props> = ({ config, ...props }) => {
  return (
    <Flex flexWrap="wrap" {...props}>
      <Box maxWidth="370px" m="40px auto 0 auto">
        <Heading scale="xxl" mb="12px">
          {config.header}
        </Heading>
        <Text mb="32px">{config.description}</Text>
        <ConnectWalletButton variant="vertoPrimary" />
      </Box>
      <Container maxWidth="752px">
        <Card background="transparent" style={{ background: 'transparent' }}>
          <Container>
            <CardBody>
              {config.questions.map(({ title, description }) => (
                <FoldableFAQs key={title} id={title} title={title}>
                  {description.map((desc, index) => {
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <Text key={`faq-${index}`} color="textSubtle" as="p">
                        {desc}
                      </Text>
                    )
                  })}
                </FoldableFAQs>
              ))}
            </CardBody>
          </Container>
        </Card>
      </Container>
    </Flex>
  )
}

export default FAQs
