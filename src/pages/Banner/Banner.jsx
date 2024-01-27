import React, { useEffect, useState } from 'react'
import Heading from '../../components/ui/Heading'
import Butoon from '../../components/ui/Butoon'
import { useDisclosure } from '@nextui-org/react';
import DataTableModel from '../../components/DateTableForModel/DataTableModel';
import BannerForm from './BannerForm';
import { DeleteBannerById, GetAllBanners, GetBannerById } from '../../apicalls/banner';
import { SetLoader } from '../../redux/loadersSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

const Banner = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [bannerData, setBannerData] = useState([]);


    const [selectedBannerVersion, setSelectedBannerVersion] = useState(true)
    const [bannerImage, setBannerImage] = useState('')
    const [overlayImage, setOverlayImage] = useState('')
    const [overlayImagesLink, setOverlayImagesLink] = useState([])
    const [bannerImageLink, setBannerImageLink] = useState('')
    const [visibility, setVisibility] = useState(true);
    const [overlayImageVisibility, setOverlayImageVisibility] = useState([true, true, true]);

    const dispatch = useDispatch();

    const columns = [
        { name: "Banner Image", uid: "bannerImageLink", },
        { name: "Visibility", uid: "isVisible" },
        { name: "Created At", uid: "createdAt" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const handleDelete = async (bannerID) => {
        try {
            dispatch(SetLoader(true));
            const response = await DeleteBannerById(bannerID);
            dispatch(SetLoader(false));
            console.log(response);
            if (response.success) {
                toast.success(response.message);
                // setBannerData(response.bannerData)
                getBannerData();
            } else {
                throw new Error(response.error || response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.log(error);
            toast.error(error || error.message);
        }
    };

    const handleUpdate = async (bannerID) => {
        try {
            const response = await GetAllBanners();
            if (response.success) {
                const existingTag = response.banners.find((cat) => cat._id === bannerID);
                if (!existingTag) {
                    throw new Error("Banner not found");
                }

                console.log(existingTag)

                onOpen();
                setVisibility(existingTag?.isVisible);
                setBannerImageLink(existingTag.bannerImageLink)
                if (existingTag?.overlayImages) {
                    setOverlayImagesLink(existingBanner.overlayImages.forEach(overlay => console.log(overlay.imageLink)));
                    setOverlayImageVisibility(existingBanner.overlayImages.map(overlay => ({
                        isVisible: overlay.isVisible
                    })));
                }

            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error updating Banner:", error);
        }
    };

    const getBannerData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetAllBanners();
            dispatch(SetLoader(false));
            console.log(response)
            if (response.success) {
                setBannerData(response.banners);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getBannerData();
    }, [])


    return (
        <>


            <div className=" w-full flex items-center justify-between  border-b pb-3 py-5">
                <div className="flex-1 ">
                    <Heading title={`Banners `} description="Manage banners for your landing page" />
                </div>
                <Butoon onOpen={onOpen} title={"Add New"} />
            </div >
            <BannerForm
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                getData={getBannerData}

                selectedBannerVersion={selectedBannerVersion}
                bannerImage={bannerImage}
                overlayImage={overlayImage}
                overlayImagesLink={overlayImagesLink}
                bannerImageLink={bannerImageLink}
                visibility={visibility}
                overlayImageVisibility={overlayImageVisibility}

                setSelectedBannerVersion={setSelectedBannerVersion}
                setBannerImage={setBannerImage}
                setOverlayImage={setOverlayImage}
                setOverlayImagesLink={setOverlayImagesLink}
                setBannerImageLink={setBannerImageLink}
                setVisibility={setVisibility}
                setOverlayImageVisibility={setOverlayImageVisibility}

            />
            {Array.isArray(bannerData) && (
                <DataTableModel columnss={columns} data={bannerData} deleteitem={handleDelete} update={handleUpdate} />
            )}
        </>
    )
}

export default Banner
