import { Resend } from 'resend';
import { Email } from '../../emails/reportSubmit';

const resend = new Resend(process.env.REACT_APP_RESEND_KEY);

export async function GET(){
    await resend.emails.send({
        from: 'more@more.com',
        to: 'more.web.develop@gmail.com',
        subject: 'hello world',
        react: <Email/>,
    });
}