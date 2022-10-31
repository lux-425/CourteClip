import { useState } from 'react'

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { GoVerified } from 'react-icons/go';

import axios from 'axios'

import VideoCard from '../../components/VideoCard';
import NoResults from '../../components/NoResults';

import { IUser, Video } from "../../types"

import { BASE_URL } from '../../utils';

import useAuthStore from '../../store/authStore';

const Search = ({ videos }: { videos: Video[] }) => {
  const [isProfiles, setIsProfiles] = useState(false)

  const router = useRouter()
  const { searchTerm }: any = router.query

  const { allUsers } = useAuthStore()

  const profiles = isProfiles ? 'border-b-2 border-black' : 'text-gray-400'
  const isVideos = !isProfiles ? 'border-b-2 border-black' : 'text-gray-400'

  const searchedProfiles = allUsers.filter((user: IUser) => user.userName.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className='w-full'>
      <div className='flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full'>
        <p onClick={() => setIsProfiles(true)} className={`text-xl font-semibold cursor-pointer mt-2 ${profiles}`}>Profiles</p>
        <p onClick={() => setIsProfiles(false)} className={`text-xl font-semibold cursor-pointer mt-2 ${isVideos}`}>Videos</p>
      </div>
      {isProfiles ? (
        <div className='md:mt-16'>
          {searchedProfiles.length > 0 ? (
            searchedProfiles.map((user: IUser, index: number) => (
              <Link href={`/profile/${user._id}`} key={index}>
                <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200'>
                  <div>
                    <Image
                      src={user.image}
                      width={50}
                      height={50}
                      className="rounded-full"
                      alt='User Profile'
                    />
                  </div>

                  <div className='xl:block'>
                    <p className='flex gap-1 items-center text-md font-bold text-primary lowercase'>
                      {user.userName.replaceAll(' ', '')}
                      <GoVerified className='text-blue-400' />
                    </p>
                    <p className='capitalize text-gray-400 text-xs'>
                      {user.userName}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : <NoResults text={`No video result for ${searchTerm}`} />}
        </div>
      ) : <div className='md:mt-16 flex flex-wrap gap-6 md:justify-start'>
        {videos.length ? (
          videos.map((video: Video, index: number) => (
            <VideoCard post={video} key={index} />
          ))
        ) : <NoResults text={`No video result for ${searchTerm}`} />}
      </div>}
    </div>
  )
}

export const getServerSideProps = async ({
  params: { searchTerm }
}: {
  params: { searchTerm: string }
}) => {
  const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`)

  return {
    props: { videos: res.data }
  }
}

export default Search