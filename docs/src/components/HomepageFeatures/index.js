import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Continuous Uptime',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Mishandled entities cause subgraphs to crash, which can be very disruptive for projects that are dependent on the graph. Set up helper functions to make your subgraphs “uncrashable” and ensure business continuity. 
      </>
    ),
  },
  {
    title: 'Completely Safe',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Common problems seen in subgraph development are issues of loading undefined entities, not setting or initializing all values of entities, and race conditions on loading and saving entities. Ensure all interactions with entities are completely safe. 
      </>
    ),
  },
  {
    title: 'User Configurable',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Set default values and configure the level of security checks that suits your individual project's needs. Be notified when there is a breach of subgraph logic and patch the issue to ensure data accuracy. 
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
