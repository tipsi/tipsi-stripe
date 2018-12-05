/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')
const PropTypes = require('prop-types')
const { Container, GridBlock } = require('../../core/CompLibrary')

const siteConfig = require(process.cwd() + '/siteConfig') // eslint-disable-line

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`
}

function pageUrl(page, language) {
  return `${siteConfig.baseUrl}${language ? `${language}/` : ''}${page}`
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    )
  }
}

Button.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  target: PropTypes.string,
}

Button.defaultProps = {
  target: '_self',
}

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
)

SplashContainer.propTypes = {
  children: PropTypes.any.isRequired,
}

const ProjectTitle = () => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
)

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
)

PromoSection.propTypes = {
  children: PropTypes.any.isRequired,
}

class HomeSplash extends React.Component {
  render() {
    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href="https://github.com/tipsi/tipsi-stripe/tree/master/example">
              Sample Project
            </Button>
          </PromoSection>
        </div>
      </SplashContainer>
    )
  }
}

const Block = props => (
  <Container padding={['bottom', 'top']} id={props.id} background={props.background}>
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
)

Block.propTypes = {
  id: PropTypes.string.isRequired,
  background: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  layout: PropTypes.string.isRequired,
}

const Showcase = (props) => {
  if ((siteConfig.users || []).length === 0) {
    return null
  }

  const showcase = siteConfig.users
    .filter(user => user.pinned)
    .map(user => (
      <a href={user.infoLink} key={user.caption}>
        <img src={user.image} title={user.caption} alt={user.caption} />
      </a>
    ))

  return (
      <div className="productShowcaseSection paddingBottom">
      <h2>Quick navigation</h2>
      <a href="/tipsi-stripe/docs/index.html">Start reading docs</a>

      <div className="logos">{showcase}</div>
    </div>
  )
}

Showcase.propTypes = {
  language: PropTypes.string,
}

Showcase.defaultProps = {
  language: undefined,
}

class Index extends React.Component {
  render() {
    const { language = '' } = this.props

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Showcase language={language} />
        </div>
      </div>
    )
  }
}

Index.propTypes = {
  language: PropTypes.string,
}

Index.defaultProps = {
  language: undefined,
}

module.exports = Index
