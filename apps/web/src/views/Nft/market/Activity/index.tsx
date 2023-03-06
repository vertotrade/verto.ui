import { Heading, PageHeader } from '@verto/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from '@verto/localization'
import ActivityHistory from '../ActivityHistory/ActivityHistory'

const Activity = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" data-test="nft-activity-title">
          {t('Activity')}
        </Heading>
      </PageHeader>
      <Page>
        <ActivityHistory />
      </Page>
    </>
  )
}

export default Activity
