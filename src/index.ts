import { Converter, ShowdownOptions } from 'showdown';

const defaultOptions: ShowdownOptions = {
    ghCompatibleHeaderId: true,
    simplifiedAutoLink: true,
    excludeTrailingPunctuationFromURLs: true,
    literalMidWordUnderscores: true,
    strikethrough: true,
    tables: true,
    tablesHeaderId: true,
    tasklists: true,
    disableForced4SpacesIndentedSublists: true,
    headerLevelStart: 3,

    extensions: [],
};

type Replace = string | ((...s: string[]) => string);

interface Extension {
    type: string;
    regex: RegExp;
    replace: Replace;
}

function extension(
    e: Partial<Extension> & Pick<Extension, 'regex'>
): Extension {
    return {
        type: 'lang',
        replace: '$&',
        ...e,
    };
}

export const REGEX_ID = /[a-zA-Z]+[a-zA-Z\.\-]+[a-zA-Z\*]/;

export class Melchior {
    entityLink: Extension;

    constructor() {
        this.entityLink = extension({
            regex: new RegExp(`\\B@(${REGEX_ID.source})`, 'g'),
            replace: '<a href="/$1">$1</a>',
        });
    }

    converter(options: ShowdownOptions) {
        let allOptions = {
            ...defaultOptions,
            ...options,
        };

        allOptions.extensions.push(() => {
            return [this.entityLink];
        });

        return new Converter(allOptions);
    }
}
