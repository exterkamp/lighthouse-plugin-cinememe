'use strict';

/** @type {LH.Config.Plugin} */
module.exports = {
  audits: [{
    path: 'lighthouse-plugin-cinememe/audits/cinememe.js',
  }],

  category: {
    title: 'Obligatory Cinememes',
    description: 'Modern webapps should have cinememes to ensure a positive ' +
      'user experience.',
    auditRefs: [
      {id: 'cinememe', weight: 1},
    ],
  },
};
