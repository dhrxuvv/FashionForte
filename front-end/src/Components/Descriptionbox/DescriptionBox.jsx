import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
    return (
        <div className='descriptionbox'>
            <div className="descriptionbox-navigator">
                <div className="descriptionbox-nav-box">Description</div>
                <div className="descriptionbox-nav-box fade">Reviews(122)</div>
            </div>
            <div className="descriptionbox-description">
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita illum asperiores impedit veniam qui quibusdam nisi, perspiciatis dicta odit labore dignissimos officiis eveniet quaerat ducimus repellat beatae aliquid ipsum accusantium.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi quia tempora alias totam. Assumenda veniam aspernatur mollitia doloremque ad eligendi, exercitationem tempore cum enim possimus quas maxime recusandae voluptatem amet.</p>
            </div>
        </div>
    )
}

export default DescriptionBox
