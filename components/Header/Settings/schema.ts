import { IForm } from '../../../../per-form';
import { COLOR_KEYS, COLOR_LABELS, MODE_KEYS, MODE_LABELS } from '../../../../themes';

export const userSettings = () => {
  return {
    launchPage: {
      type: 'text',
      label: 'Default page',
      required: false,
    },
    themeColor: {
      type: 'select',
      label: 'Colour',
      options: COLOR_KEYS.map(k => ({ key: k, text: COLOR_LABELS[k], value: k })),
    },
    themeMode: {
      type: 'select',
      label: 'Theme',
      options: MODE_KEYS.map(k => ({ key: k, text: MODE_LABELS[k], value: k })),
    },
    fontSize: {
      type: 'select',
      label: 'Font Size',
      options: [
        { text: 'Small', value: 1.0 },
        { text: 'Medium', value: 1.14 },
        { text: 'Large', value: 1.29 },
      ],
      defaultValue: 1,
      converter: (_key: string, values: IForm) => parseFloat(values['fontSize']) || 1.0,
    },
  };
};
