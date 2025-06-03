import React, { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../contexts/AppContext'

const Doctors = () => {
    const { speciality } = useParams()
    const { doctors, setDoctors } = useContext(AppContext)
    const [filterDoc, setFilterDoc] = useState([])
    const [showFilter, setShowFilter] = useState(false)
    const navigate = useNavigate();
    // ✅ Fetch danh sách bác sĩ nếu context đang trống
    useEffect(() => {
        if (!doctors || doctors.length === 0) {
            fetch('http://localhost:3000/api/doctors')
                .then(res => res.json())
                .then(data => {
                console.log('Doctors từ API:', data); // 👈 Thêm dòng này
                setDoctors(data)
            })
                .catch(err => console.error('Lỗi khi fetch doctors:', err));
        }
    }, [doctors, setDoctors])

    // ✅ Lọc bác sĩ theo chuyên khoa (hoặc toàn bộ)
    const applyFilter = () => {
        if (speciality) {
            setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
        } else {
            setFilterDoc(doctors)
        }
    }

    useEffect(() => {
        applyFilter()
    }, [doctors, speciality])

    return (
        <div>
            <p className='text-gray-600'>Browse through the doctors specialist.</p>
            <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
                <button className={`py-1 px-3 border rounded-none text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={() => setShowFilter(prev => !prev)}>Filters</button>
                <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                    {/* Các filter */}
                    {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Gastroenterologist'].map((s, idx) => (
                        <p key={idx}
                            onClick={() => speciality === s ? navigate('/doctors') : navigate(`/doctors/${s}`)}
                            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === s ? "bg-indigo-100 text-black" : ""}`}>
                            {s}
                        </p>
                    ))}
                </div>

                <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
                    {filterDoc.map((item, index) => (
                        
                        <div onClick={() => navigate(`/appointment/${item.id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                            <img className='bg-blue-50 w-full h-52 object-cover' src={`http://localhost:3000${item.avatar_url}`} alt={item.name}/>
                            <div className='p-4'>
                                <div className='flex items-center gap-2 text-sm text-center text-green-500 '>
                                    <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                                </div>
                                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                                <p className='text-gray-600 text-sm'>{item.speciality}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Doctors
