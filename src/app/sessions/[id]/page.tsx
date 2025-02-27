"use client"

import { use } from 'react';
import { isEmpty } from 'lodash';
import Pad from '@/components/pad';
import { useQuery } from '@tanstack/react-query';
import SelectedPad from '@/components/selected-pad';
import { getPadsFromSession } from '@/lib/session';

export default function Session({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt(use(params).id);

  const { data: pads, isLoading, error } = useQuery({
    queryKey: ['session', id],
    queryFn: () => getPadsFromSession(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching pads: {(error as Error).message}</div>;

  return (
    <div className="flex gap-4 h-screen p-4">
      <div className="flex flex-col gap-4 justify-between min-w-[320px]">
        <SelectedPad />
      </div>
      <div className='grid grid-cols-4 gap-4'>
        {pads && !isEmpty(pads) && pads.map((pad) => (
          <Pad key={JSON.stringify(pad)} pad={pad} />
        ))}
      </div>
    </div>
  )
}