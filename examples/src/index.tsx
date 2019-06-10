/* @jsx cba.createElement */

import cba, { render } from 'cba';
import { Example1 } from './example-1';
import { Example2 } from './example-2';

render(<Example1 />, document.getElementById('example-1') as HTMLElement);
render(<Example2 />, document.getElementById('example-2') as HTMLElement);
