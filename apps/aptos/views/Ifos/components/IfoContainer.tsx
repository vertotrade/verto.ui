import { ReactElement } from 'react'
import { useTranslation } from '@verto/localization'
import { Container, LinkExternal } from '@verto/uikit'
import IfoLayout, { IfoLayoutWrapper } from './IfoLayout'
import IfoPoolVaultCard from './IfoPoolVaultCard'

interface TypeProps {
  ifoSection: ReactElement
}

const IfoContainer: React.FC<React.PropsWithChildren<TypeProps>> = ({ ifoSection }) => {
  const { t } = useTranslation()

  return (
    <IfoLayout id="current-ifo" py={['24px', '24px', '40px']}>
      <Container>
        <IfoLayoutWrapper>
          <IfoPoolVaultCard />
          {ifoSection}
        </IfoLayoutWrapper>
      </Container>
      <Container>
        <LinkExternal
          href="https://docs.pancakeswap.finance/contact-us/business-partnerships#ifos-token-sales"
          mx="auto"
          mt="16px">
          {t('Apply to run an IFO!')}
        </LinkExternal>
      </Container>
    </IfoLayout>
  )
}

export default IfoContainer
