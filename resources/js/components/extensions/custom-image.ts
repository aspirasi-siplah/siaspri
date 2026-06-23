import Image from '@tiptap/extension-image';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        customImage: {
            setImageWidth: (width: string) => ReturnType;
            setTextWrap: (textWrap: boolean) => ReturnType;
            setImageAlign: (align: 'left' | 'center' | 'right') => ReturnType;
        };
    }
}

export const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
            },
            align: {
                default: 'center',
            },
            textWrap: {
                default: false,
            },
            alt: {
                default: '',
            },
        };
    },

    renderHTML({ HTMLAttributes }) {
        const align = HTMLAttributes.align ?? 'center';
        const textWrap = HTMLAttributes.textWrap ?? false;
        const width = HTMLAttributes.width ?? '100%';

        let style = `width:${width};`;

        if (textWrap && align === 'left') {
            style += `
                float:left;
                margin:0 1rem 1rem 0;
            `;
        } else if (textWrap && align === 'right') {
            style += `
                float:right;
                margin:0 0 1rem 1rem;
            `;
        } else {
            style += `
                float:none;
                clear:both;
                display:block;
            `;

            if (align === 'left') {
                style += `
                margin:1rem auto 1rem 0;
            `;
            }

            if (align === 'center') {
                style += `
                margin:1rem auto;
            `;
            }

            if (align === 'right') {
                style += `
                margin:1rem 0 1rem auto;
            `;
            }
        }

        return [
            'img',
            {
                ...HTMLAttributes,
                style,
            },
        ];
    },
    addCommands() {
        return {
            ...this.parent?.(),
            setImageWidth:
                (width: string) =>
                ({ commands }: { commands: any }) => {
                    return commands.updateAttributes('image', {
                        width,
                    });
                },
            setImageAlign:
                (align: 'left' | 'center' | 'right') =>
                ({ commands }: { commands: any }) => {
                    return commands.updateAttributes('image', {
                        align,
                    });
                },
            setTextWrap:
                (textWrap: boolean) =>
                ({ commands }: { commands: any }) => {
                    return commands.updateAttributes('image', {
                        textWrap,
                    });
                },
        };
    },
});
