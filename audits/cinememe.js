'use strict';

const Audit = require('lighthouse').Audit;

/**
 * @fileoverview Audits if a page has a `cinememe`.
 */

class CinememeAudit extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'cinememe',
      title: 'Has cinememes',
      failureTitle: 'Does not have cinememes',
      description: 'This page should have a cinememe in order to be a modern ' +
        'webapp.',
      requiredArtifacts: ['ImageElements'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {LH.Audit.Product}
   */
  static audit(artifacts) {
    // Find them memes
    let hasCinememe = false;

    /** @type {Array<{src: string, mimeType: string, resourceSize: number}>} */
    const results = [];
    artifacts.ImageElements.filter(image => {
      // - filter out css background images since we don't have a reliable way
      //   to tell if it's a sprite sheet, repeated for effect, etc
      // - filter out images that don't have following properties:
      //   networkRecord, width, height, images that use `object-fit`: `cover`
      //   or `contain`
      // - filter all svgs as they have no natural dimensions to audit
      return !image.isCss &&
        image.mimeType &&
        image.mimeType !== 'image/svg+xml' &&
        image.naturalHeight > 5 &&
        image.naturalWidth > 5 &&
        image.displayedWidth &&
        image.displayedHeight;
    }).forEach(image => {
      if (image.mimeType === 'image/gif' && image.resourceSize >= 5000000) {
        hasCinememe = true;
      } else {
        // If this isn't a cinememe, add it to the list of images that COULD be.
        results.push(image);
      }
    });

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      {key: 'src', itemType: 'thumbnail', text: ''},
      {key: 'src', itemType: 'url', text: 'url'},
      {key: 'mimeType', itemType: 'text', text: 'MIME type'},
      {key: 'resourceSize', itemType: 'text', text: 'Resource Size'},
    ];

    return {
      score: hasCinememe > 0 ? 1 : 0,
      details: Audit.makeTableDetails(headings, results),
    };
  }
}

module.exports = CinememeAudit;
