/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')
const PropTypes = require('prop-types')

class Footer extends React.Component {
  docUrl = (doc, language) => {
    const { baseUrl } = this.props.config
    return `${baseUrl}docs/${language ? `${language}/` : ''}${doc}`
  }

  pageUrl(doc, language) {
    const { baseUrl } = this.props.config
    return `${baseUrl}${language ? `${language}/` : ''}${doc}`
  }

  render() {
    const currentYear = new Date().getFullYear()
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('index.html', this.props.language)}>
              Getting Started
            </a>
            <a href={this.docUrl('running-apple-pay-on-a-real-device.html', this.props.language)}>
              Running on Device
            </a>
            <a href={this.docUrl('index.html', this.props.language)}>
              API Reference
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href={`${this.props.config.baseUrl}blog`}>Blog</a>
            <a href="https://github.com/">GitHub</a>
            <a
              data-show-count
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/tipsi/tipsi-stripe/stargazers"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a>
          </div>
        </section>
        <section className="copyright">
          Copyright &copy; {currentYear} Tipsi.
        </section>
      </footer>
    )
  }
}

Footer.propTypes = {
  config: PropTypes.object.isRequired,
  language: PropTypes.string,
}

Footer.defaultProps = {
  language: undefined,
}

module.exports = Footer
