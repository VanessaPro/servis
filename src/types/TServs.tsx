import {TImageItem} from './TImageItem.'

export interface TServs {
  id:string;
  name:string;
  uid:string;
  price: string | number;
  city:string;
  images:TImageItem[];
  description:string;
}