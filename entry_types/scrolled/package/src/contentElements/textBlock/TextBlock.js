import React from 'react';
import classNames from 'classnames';
import {
  EditableText,
  useContentElementConfigurationUpdate,
  useDarkBackground,
  useI18n
} from 'pageflow-scrolled/frontend';

import styles from './TextBlock.module.css';

export function TextBlock(props) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const dark = useDarkBackground();
  const {t} = useI18n({locale: 'ui'});

  const className = classNames(styles.text,
                               {[styles.darkBackground]: dark},
                               styles[`layout-${props.sectionProps.layout}`]);
  return (
    <EditableText value={props.configuration.value}
                  contentElementId={props.contentElementId}
                  className={className}
                  selectionRect={true}
                  placeholder={t('pageflow_scrolled.inline_editing.type_text')}
                  onChange={value => updateConfiguration({value})} />
  );
}
