import React, { useCallback, useRef, useState } from 'react';
import Head from 'next/head'
import DefaultLayout from '../layouts/DefaultLayout';
import { Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { fetchContent, HomepageConfig, GeneralConfig, strapiImage } from '../api';

import PositionModal from '../components/modals/PositionModal';
import Callback from '../components/forms/Callback';
import Pixel from '../components/facebook/Pixel';

export default function Home({ data, general }) {
  // swiper arrows
  const sliderRef = useRef();

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  // opened position
  const positionsSection = useRef();
  const [showPositions, setShowPositions] = useState(4);

  const handleShowAllPositions = (quantity) => {
    if (showPositions > 4) {
      setShowPositions(4);
      positionsSection.current.scrollIntoView();

    } else {
      setShowPositions(quantity)
    }
  };

  // about us
  const [showAllText, setShowAllText] = useState(false);

  const handleShowAllText = () => {
    return showAllText ? setShowAllText(false) : setShowAllText(true);
  }

  return (
    <>
      <Head>
        <title>AK Investment</title>
        <meta name="keywords" content="AK, Investment, AK Investment, Строительство судов, Работа в Польше" />
        <meta name="description" content="Мы профессиональная и стабильная компания, непрерывно работающая на рынке услуг, связанных со строительством судов с 2015 года. Нашей целью является предоставление качественных услуг нашим партнерам, производителям яхт и катамаранов."/>
        <link rel="icon" href="/favicon.png"/>
        <Pixel />
      </Head>
      <DefaultLayout data={general}>
        <section className="hero-banner">
          <Container>
            <Row>
              <Col xs={12}>
                <h1>
                  {data.HeroBanner.Title}
                </h1>
                <p dangerouslySetInnerHTML={{__html: data.HeroBanner.Description}} />
                <Link href="/apply">
                  <button className="btn btn-primary">
                    {data.HeroBanner.Button}
                  </button>
                </Link>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="opened-positions" ref={positionsSection}>
          <Container>
            <Row className="justify-content-center">
              <Col lg={12}>
                <Row className="title-row justify-content-between align-items-center">
                  <Col xs="auto">
                    <h4>
                      {data.Vacancies.Title}
                    </h4>
                  </Col>
                </Row>
              </Col>
              <Col lg={12}>
                <Row className="gy-4">
                  {data.Vacancies.Vacancies.data.slice(0, showPositions).map((vacancy, index) => (
                    <Col lg={6} key={index}>
                      <div className="position-block">
                        <div className="block-title">
                          <div className="block-icon">
                            <Image src={strapiImage(vacancy.attributes.Icon.data.attributes.url)} layout="fixed" width={48} height={48} alt="icon" />
                          </div>
                          <div className="block-name">
                            {vacancy.attributes.Title}
                          </div>
                        </div>
                        <div className="block-benefits">
                          <Row className="gy-3">
                            {vacancy.attributes.Benefits.map((benefit, index) => (
                              <Col xs="auto" key={index}>
                                <div className="benefit-block">
                                  <div className="block-icon">
                                    <Image src={strapiImage(benefit.Icon.data.attributes.url)} layout="fixed" width={14} height={14} alt="icon" />
                                  </div>
                                  <div className="block-title">
                                    {benefit.Text}
                                  </div>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>
                        <div className="block-description">
                          <p dangerouslySetInnerHTML={{__html: vacancy.attributes.ShortDescription}} />
                          <PositionModal
                            data={vacancy.attributes}
                            buttonTitle={vacancy.attributes.ButtonDetails}
                          />
                        </div>
                        <div className="block-actions">
                          <Link href="/apply">
                            <button className="btn btn-primary">
                              {vacancy.attributes.Button}
                            </button>
                          </Link>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>
              <Col xs={12}>
                <Row className="actions-row justify-content-center">
                  <Col xs="auto">
                    <button
                      className={`btn btn-primary ${showPositions > 4 ? `btn-arrow-up` : `btn-arrow-down`}`}
                      onClick={() => handleShowAllPositions(data.Vacancies.Vacancies.data.length)}
                    >
                      {showPositions > 4 ? data.Vacancies.ButtonHide : data.Vacancies.Button}
                    </button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="wide-slider">
          <Container>
            <Row>
              <Col xs={12}>
                <h3>
                  {data.Slider.Title}
                </h3>
                <p dangerouslySetInnerHTML={{__html: data.Slider.Description}} />
              </Col>
            </Row>
          </Container>
          <Container fluid className="p-0">
            <Row>
              <Col xs={12}>
                <Swiper
                  ref={sliderRef}
                  modules={[Pagination, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  speed={800}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  className="homepage-slider"
                  pagination={{ clickable: true }}
                >
                  {data.Slider.ImageGallery.data.map((image, index) => (
                    <SwiperSlide key={index}>
                      <Image src={strapiImage(image.attributes.url)} layout="fill" objectFit="cover" objectPosition="center"
                             alt="AK Investment"/>
                    </SwiperSlide>
                  ))}
                  <div className="swiper-arrow prev-slide" onClick={() => handlePrev()} />
                  <div className="swiper-arrow next-slide" onClick={() => handleNext()} />
                </Swiper>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="double-section">
          <Container>
            <Row>
              <Col lg={7}>
                <Row>
                  <Col xs={12} className="about-us">
                    <h3>
                      {data.About.Title}
                    </h3>
                    <p dangerouslySetInnerHTML={{__html: data.About.Description}} />
                  </Col>
                </Row>
              </Col>
              <Col lg={5} className="partners">
                <h3>
                  {data.Partners.Title}
                </h3>
                <Row className="gy-4">
                  {data.Partners.PartnerLogos.data.map((logo, index) => (
                    <Col xs="auto" key={index}>
                      <div className="partner-block">
                        <Image src={strapiImage(logo.attributes.url)} layout="fill" objectFit="contain" objectPosition="left"
                               alt="AK Investment" />
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="steps">
          <Container>
            <Row>
              <Col xs={12}>
                <h3>
                  {data.EmploymentSteps.Title}
                </h3>
                <p>
                  {data.EmploymentSteps.Description}
                </p>
                <Row className="justify-content-between gx-0 gy-5 gy-lg-0">
                  {data.EmploymentSteps.Step.map((step, index) => (
                    <Col lg={3} key={index}>
                      <div className={`step-block ${index === 0 && 'first-child'} ${index === data.EmploymentSteps.Step.length -1 && 'last-child'}`}>
                        <div className="block-number">
                          {index + 1}
                        </div>
                        <div className="block-title">
                          {step.Title}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="contacts">
          <Container>
            <Row className="gy-5">
              <Col lg={7}>
                <div className="shadow-container">
                  <h3>
                    {data.Contacts.Title}
                  </h3>
                  <div className="contacts-blocks">
                    {data.Contacts.Contact.map((contact, index) => (
                      <div className="contacts-block" key={index}>
                        <div className="block-icon">
                          <Image src={strapiImage(contact.Icon.data.attributes.url)} layout="fixed" width={18} height={18} alt="icon" />
                        </div>
                        <div className="block-title">
                          {
                            contact.Type === 'Phone' ? (
                              <Link href={`tel:${contact.Text}`}>
                                {contact.Text}
                              </Link>
                            ) : contact.Type === 'Email' ? (
                              <Link href={`mailto:${contact.Text}`}>
                                {contact.Text}
                              </Link>
                            ) : (
                              <Link href="#">
                                {contact.Text}
                              </Link>
                            )
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="map-block">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.0867798002178!2d20.9945636!3d52.2418074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecc7d993efdd9%3A0x1abcc2fc68cf8460!2zYWxlamEgIlNvbGlkYXJub8WbY2kiIDExNywgMDAtMTQwIFdhcnN6YXdhLCDQn9C-0LvRjNGI0LA!5e0!3m2!1sru!2sua!4v1663012559515!5m2!1sru!2sua"
                      loading="lazy"
                    />
                  </div>
                </div>
              </Col>
              <Col lg={5}>
                <div className="shadow-container">
                  <h3>
                    {data.Callback.Title}
                  </h3>
                  <p dangerouslySetInnerHTML={{__html: data.Callback.Description}} />
                  <Callback />
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </DefaultLayout>
    </>
  )
}

export const getStaticProps = async () => {
  try {
    const data = await fetchContent('homepage', HomepageConfig);
    const general = await fetchContent('general', GeneralConfig);

    return {
      props: {
        data,
        general
      },
    };
  } catch (error) {
    console.error(error);
  }

  return {
    props: {},
  };
};