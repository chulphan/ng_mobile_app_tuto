import { Color } from 'tns-core-modules/color';
import { TextField } from 'tns-core-modules/ui/text-field';

declare var NsAttributedString: any;
declare var NsDictionary: any;
declare var NSForegroundColorAttributeName: any;

export function setHintColor(args: { view: TextField, color: Color} ) {
    if (args.view.android) {
        args.view.android.setHintTextColor(args.color.android);
    }
    if(args.view.ios){
        let dictionary = new NsDictionary(
        [args.color.ios],
        [NSForegroundColorAttributeName]
    );
    args.view.ios.attributedPlaceholder = NsAttributedString.alloc()
        .initWithStringAttributes(args.view.hint, dictionary);}
}