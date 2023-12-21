import { NotFound } from '@verto/uikit'
import Image from 'next/image'
import Image404 from '../../public/images/404.png'

const NotFoundPage = () => <NotFound image={<Image src={Image404} alt="Not Found 404" />} />

NotFoundPage.chains = []

export default NotFoundPage
