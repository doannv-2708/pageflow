import {editor, NoOptionsHintView} from 'pageflow-scrolled/editor';
import {CheckBoxInputView} from 'pageflow/ui';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('question', {
  pictogram,
  supportedPositions: ['inline'],

  configurationEditor({entry, contentElement}) {
    this.tab('general', function() {
      this.input('expandByDefault', CheckBoxInputView);
    });
  },
});
