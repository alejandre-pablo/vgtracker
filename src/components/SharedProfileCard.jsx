import { doc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { useFirestore, useFirestoreDocDataOnce, useStorage } from 'reactfire';

const SharedProfileCard = (props) => {

    const storage = useStorage();
    const firestore = useFirestore();

    const { userId, list } = props;
    const profileDataRef = doc(firestore, 'profiles', userId);
    const {status, data: profile} = useFirestoreDocDataOnce(profileDataRef);
    const [profilePictureURL, setProfilePictureUrl] = useState('');

    useEffect(() => {
        //Check if the user has a profile picture
        if(status === 'success' && profile.picture !== ''){
            // Fetch the profile picture URL from Firebase Storage
            const imageRef =ref(storage, `images/${userId}`)
            getDownloadURL(imageRef)
            .then(url => {
                // Set the profile picture URL in the state
                setProfilePictureUrl(url);
            })
            .catch(error => {
                console.error('Error fetching profile picture:', error);
            });
        }
        
    }, [status]);

    return (
        <div className='sharedProfileCard'>
            <img 
                src={profilePictureURL ? profilePictureURL : window.location.origin +'/img/profile.svg.png'} 
                referrerPolicy="no-referrer"  
                alt='Profile Pic' 
                className='sharedProfilePicture'/>
            <strong style={{marginTop: '1rem'}}>{profile ? `${profile.username}'s list` : ''}</strong>
            <span>{`${list.length} games logged`}</span>
        </div>
    )
}

export default SharedProfileCard