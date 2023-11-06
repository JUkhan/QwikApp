import { createContextId, QRL } from "@builder.io/qwik";
import prisma from "./prismaClient";
import { v4 } from 'uuid';
import { RequestEventAction, server$ } from "@builder.io/qwik-city";
import nodemailer from 'nodemailer';
export interface User {
  username: string;
  password: string;
}

export enum UserRules {
  admin = 'admin',
  user = 'user',
  visitor = 'visitor'
}

export interface AppState {
  toast: { type: 'info' | 'success' | 'error', msg?: string },
  user?:{id:number, name:string, email:string, rules:string}
  theme:string,
  sideBarOpened:boolean,
  DynamicCom:any,
  formData:any,
  show:QRL<(this: AppState) => void>,
  hide:QRL<(this: AppState) => void>
  activeMenu:string
}

export const AppContext = createContextId<AppState>('app.gift.context');

export const getCodes = () => {
  const arr = v4().split('-');
  return [arr[4].substring(4).toUpperCase(), arr[0].toUpperCase(), (arr[1] + arr[2]).toUpperCase()];
}

export enum Status {
  submitted = 'submitted',
  verified = 'verified',
  requested = 'requested',
  payment = 'payment',
  partiallyPaid = 'partially_paid',
  paid = 'paid'
}

export async function getUniqueCode(): Promise<string> {
  const arr = getCodes();
  for (const code of arr) {
    const find = await prisma.transaction.findUnique({ where: { code } });
    if (!find) {
      return code;
    }
  }
  return getUniqueCode();
}

export function getAvailableAmount(arr: any[], amount: number) {
  const data = arr.map(d => [d.amount.match(/\d+/g).map((d: any) => +d), d.cost])
  let res = 0;
  for (const [range, charge] of data) {
    if (range.length === 1) {
      if (amount > range[0]) {
        res = amount - charge
      }
    } else if (range.length === 2) {
      if (amount >= range[0] && amount <= range[1]) {
        res = amount - charge;
        break;
      }
    }
  }
  return res || amount;
}

export const getUser = (request: RequestEventAction<any>) => {
  const session = request.sharedMap.get('session');
  if (!session) return null;
  const name = session.user.name;
  return prisma.user.findUnique({ where: { name } });
}

export const DeletedMessage='Deleted Successfully';
export const AddedMessage='Added Successfully';
export const UpdatedMessage='Updated Successfully';
export const ConfirmedTitle='Confirm Delete'
export const ConfirmedMessage='Are you sure you want to delete?';

export const sendMail=server$(async function sendMail(data: any){
  const test =  await nodemailer.createTestAccount();
 
  const transporter = await nodemailer.createTransport({
    host:test.smtp.host,
    port:test.smtp.port,
    secure:test.smtp.secure,
    //service: 'gmail',
    auth: {
      user: test.user, //process.env.AUTH_SECRET
      pass: test.pass
    }
  });
  
  const mailOptions = {
    from: 'jasim.uddin.khan@gmail.com', 
    to: data.recipientEmail,
    subject: 'Message from Gift system',
    //text: 'That was easy!',
    html:`<h1>Welcome!</h1><p>Your Gift code is(<b>${data.code}</b>)</p>`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

})