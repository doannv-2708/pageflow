import React, {useState} from 'react';
import classNames from 'classnames';

import PlayIcon from '../assets/images/playerControls/play_arrow_24px.svg';
import PauseIcon from '../assets/images/playerControls/pause_24px.svg';
import SubtitlesIcon from '../assets/images/playerControls/subtitles_24px.svg';
import SettingsIcon from '../assets/images/playerControls/settings_24px.svg';

import {ProgressIndicators} from './ProgressIndicators'
import {TimeDisplay} from './TimeDisplay'
import {ContextMenu} from './ContextMenu'

import styles from './ControlBar.module.css';
import styleTransparent from './styles/ControlBarTransparent.module.css';
import styleWhite from './styles/ControlBarWhite.module.css';
import styleBlack from './styles/ControlBarBlack.module.css';

export function ControlBar(props) {
  const [settingsMenuHidden, setSettingsMenuHidden] = useState(props.settingsMenuHidden);
  const [subtitlesMenuHidden, setSubtitlesMenuHidden] = useState(props.subtitlesMenuHidden);

  const style = {
    transparent: styleTransparent,
    white: styleWhite,
    black: styleBlack
  }[props.style];

  return (
    <div className={classNames(styles.controlBarContainer,
                               style.background,
                               {[styles.inset]: !!props.fullWidth})}>
      <div className={classNames(styles.controlBar, style.foreground)}>
        <div className={styles.controlsContainer}>
          <div className={styles.controls}>
            <PlayIcon className={styles.playButton}/>
            <PauseIcon className={styles.pauseButton}/>
          </div>
        </div>
        <div className={classNames(styles.controlsContainer, styles.progressDisplayContainer)}>
          <div className={styles.controls}>
            <ProgressIndicators/>
          </div>
        </div>
        <div className={classNames(styles.controlsContainer, styles.timeDisplayContainer)}>
          <div className={styles.controls}>
            <TimeDisplay/>
          </div>
        </div>
        <div className={styles.controlsContainer}>
          <div className={styles.controls}>
            <SettingsIcon className={classNames(styles.settingsButton,
                                                {[styles.hidden]: props.type === 'audio'})}
                          onClick={() => setSettingsMenuHidden(!settingsMenuHidden)}/>
            <SubtitlesIcon className={styles.subtitlesButton}
                           onClick={() => setSubtitlesMenuHidden(!subtitlesMenuHidden)}/>
          </div>
        </div>

        <ContextMenu className={classNames(styles.settingsMenu,
                                           {[styles.hidden]: settingsMenuHidden})}
                     theme={style}
                     entries={['Automatisch', '1024p', '720p']} />
        <ContextMenu className={classNames(styles.subtitlesMenu,
                                           {[styles.hidden]: subtitlesMenuHidden})}
                     theme={style}
                     entries={['Automatisch', 'Deutsch', 'English']} />
      </div>
    </div>
  );
}

ControlBar.defaultProps = {
  type: 'video',
  style: 'transparent',
  fullWidth: false,
  settingsMenuHidden: true,
  subtitlesMenuHidden: true
};
