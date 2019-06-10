/* @jsx cba.createElement */

import cba, { render } from 'cba';
import { Example1 } from './example-1';

render(<Example1 />, document.getElementById('example-1') as HTMLElement);
