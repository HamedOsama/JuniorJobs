import { Input } from '@components/UI/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { Textarea } from '@components/UI/textarea';
import { Button } from '@components/UI/Button';
import React, { LegacyRef } from 'react';
import { Loader2 } from 'lucide-react';


const IssueSchema = z.object({
    email: z.string().email('Invalid email format'),
    description: z.string().min(50, 'Description must be at least 50 characters').max(1024, 'Description can have at most 1024 characters'),
});
type IssueSchema = z.infer<typeof IssueSchema>

const Reports = () => {
  const [Loading,isLoading] = React.useState<boolean>(false)
  const successLink = React.useRef<HTMLAnchorElement>()
  const { 
    register, 
    handleSubmit,
    formState: { errors } } = useForm<IssueSchema>({
    resolver: zodResolver(IssueSchema)
  });

  const onSubmit:SubmitHandler<IssueSchema> = async (data) => {
    const appendType = {...data,type:'issue'}
      isLoading(true)
      const request = await fetch('/api/report',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
      },
      body:JSON.stringify(appendType)
    })
    if(request.status === 201){
      successLink.current?.click()
    }
};

return (
    <form onSubmit= {handleSubmit(onSubmit)} className='flex flex-col gap-4 z-50'>
      <div>
        <label>Email</label>
        <Input id='email' placeholder='Enter your email address' type="email" {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label>What is the problem ?</label>
        <Textarea id='description' placeholder="We're excited to hear your suggestions!" className='h-[17rem] text-start' {...register('description')} />
        {errors.description && <p>{errors.description.message}</p>}
      </div>
      <div className='flex items-center gap-16 my-4'>
        <p className='text-xs text-input'>You can also email us directly at <a href="mailto:help@zjunior.com" className='underline'>help@zjunior.com</a></p>
        {Loading ?
          <Button  disabled><Loader2 className='animate-spin'/></Button> 
          : <Button className='' type="submit">Report</Button>
        }
        <a href="/success" ref={successLink} className='sr-only' id='dis'></a>
      </div>
    </form>
  );
};

export default Reports;
