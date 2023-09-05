import { VertoHeading, PageHeader } from '@verto/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from '@verto/localization'
import ActivityHistory from '../ActivityHistory/ActivityHistory'

const Activity = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader>
        <VertoHeading scale="xxl" mb="4px">
          {t('Activity')}
        </VertoHeading>
      </PageHeader>
      <Page>
        <ActivityHistory />
      </Page>
    </>
  )
}

export default Activity
