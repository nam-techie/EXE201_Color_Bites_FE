export interface User {
   id: string
   name: string
   avatar: string
}

export interface ChallengeSubmission {
   id: string
   challengeId: string
   user: User
   image: string
   caption: string
   createdAt: string
   likes: number
   comments: number
   location?: {
      name: string
      lat: number
      lon: number
      address: string
   }
}

export interface Challenge {
   id: string
   title: string
   description: string
   type: 'daily' | 'weekly'
   hashtag: string
   startDate: string
   endDate: string
   participants: number
   submissions: ChallengeSubmission[]
   reward: {
      title: string
      description: string
      value?: string
   }
   category: 'cuisine' | 'color' | 'ingredient' | 'location'
   isActive: boolean
   isJoined?: boolean
   coverImage?: string
}

export const mockChallenges: Challenge[] = [
   {
      id: '1',
      title: 'Món Ăn An Ủi Cuối Tuần',
      description: 'Chia sẻ món ăn comfort food yêu thích của bạn! Những món ăn ấm áp, thân thuộc giúp xua tan mệt mỏi cuối tuần.',
      type: 'weekly',
      hashtag: '#MonAnAnUi',
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      participants: 156,
      category: 'cuisine',
      isActive: true,
      isJoined: true,
      coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
      reward: {
         title: '🎁 Voucher 500K',
         description: 'Voucher ăn uống tại các nhà hàng đối tác',
         value: '500.000 VNĐ'
      },
      submissions: [
         {
            id: 'sub1',
            challengeId: '1',
            user: {
               id: 'user1',
               name: 'Nguyễn Thị Anh',
               avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/buon_1.jpg'),
            caption: 'Phở bò Nam Định - món ăn an ủi hoàn hảo cho ngày mưa! Nước dùng đậm đà, bánh phở dai ngon 🍜 #MonAnAnUi',
            createdAt: '2024-01-16T10:30:00Z',
            likes: 124,
            comments: 18,
            location: {
               name: 'Phở Bò Nam Định - Nguyễn Thị Minh Khai',
               lat: 10.762622,
               lon: 106.660172,
               address: '123 Nguyễn Thị Minh Khai, Quận 1, TP.HCM'
            }
         },
         {
            id: 'sub2',
            challengeId: '1',
            user: {
               id: 'user2',
               name: 'Trần Văn Bình',
               avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/buon_2.jpg'),
            caption: 'Bún chả Hà Nội - hương vị quê nhà không thể nào quên! Thịt nướng thơm lừng, nước mắm chua ngọt vừa miệng 🥢 #MonAnAnUi',
            createdAt: '2024-01-16T14:20:00Z',
            likes: 89,
            comments: 12,
            location: {
               name: 'Bún Chả Hà Nội - Lê Lợi',
               lat: 10.7769,
               lon: 106.7009,
               address: '456 Lê Lợi, Quận 1, TP.HCM'
            }
         },
      ],
   },
   {
      id: '2',
      title: 'Săn Món Ăn Màu Đỏ',
      description: 'Tìm và chụp ảnh các món ăn có màu đỏ nổi bật! Từ trái cây, bánh kẹo đến các món ăn truyền thống.',
      type: 'daily',
      hashtag: '#SanMonAnDo',
      startDate: '2024-01-16',
      endDate: '2024-01-16',
      participants: 89,
      category: 'color',
      isActive: true,
      isJoined: false,
      coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
      reward: {
         title: '🏆 Giải Nhất 200K',
         description: 'Tiền mặt cho người có ảnh đẹp nhất',
         value: '200.000 VNĐ'
      },
      submissions: [
         {
            id: 'sub3',
            challengeId: '2',
            user: {
               id: 'user3',
               name: 'Lê Thị Cẩm',
               avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/maudo_1.jpg'),
            caption: 'Bánh trung thu nhân đậu đỏ truyền thống! Màu đỏ đẹp mắt, hương vị đậm đà 🥮 #SanMonAnDo',
            createdAt: '2024-01-16T09:15:00Z',
            likes: 67,
            comments: 8,
            location: {
               name: 'Tiệm Bánh Truyền Thống - Đồng Khởi',
               lat: 10.7769,
               lon: 106.7009,
               address: '789 Đồng Khởi, Quận 1, TP.HCM'
            }
         },
         {
            id: 'sub4',
            challengeId: '2',
            user: {
               id: 'user4',
               name: 'Phạm Văn Dũng',
               avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/maudo_2.jpg'),
            caption: 'Dâu tây tươi ngon - màu đỏ rực rỡ, vị ngọt thanh mát! 🍓 #SanMonAnDo',
            createdAt: '2024-01-16T11:30:00Z',
            likes: 45,
            comments: 6,
            location: {
               name: 'Vườn Dâu Tây Đà Lạt - Lâm Đồng',
               lat: 11.9404,
               lon: 108.4583,
               address: 'Đường Trần Hưng Đạo, TP. Đà Lạt, Lâm Đồng'
            }
         },
         {
            id: 'sub5',
            challengeId: '2',
            user: {
               id: 'user5',
               name: 'Hoàng Thị Mai',
               avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/maudo_3.jpg'),
            caption: 'Cà chua bi organic - màu đỏ tươi, giàu vitamin C! 🍅 #SanMonAnDo',
            createdAt: '2024-01-16T15:45:00Z',
            likes: 32,
            comments: 4,
            location: {
               name: 'Nông Trại Organic - Củ Chi',
               lat: 11.0067,
               lon: 106.5147,
               address: 'Xã Phú Hòa Đông, Huyện Củ Chi, TP.HCM'
            }
         },
      ],
   },
   {
      id: '3',
      title: 'Khám Phá Ẩm Thực Châu Á',
      description: 'Chia sẻ những món ăn châu Á ngon nhất bạn từng thưởng thức! Từ Nhật, Hàn, Thái đến các món Á khác.',
      type: 'weekly',
      hashtag: '#KhamPhaChauA',
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      participants: 234,
      category: 'cuisine',
      isActive: true,
      isJoined: true,
      coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
      reward: {
         title: '✈️ Chuyến Du Lịch',
         description: 'Chuyến du lịch khám phá ẩm thực châu Á',
         value: '5.000.000 VNĐ'
      },
      submissions: [
         {
            id: 'sub6',
            challengeId: '3',
            user: {
               id: 'user1',
               name: 'Nguyễn Thị Anh',
               avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/truyenthongVietNam_1.jpg'),
            caption: 'Sushi Omakase tại nhà hàng Nhật cao cấp! Mỗi miếng sushi là một tác phẩm nghệ thuật 🍣 #KhamPhaChauA',
            createdAt: '2024-01-16T12:45:00Z',
            likes: 156,
            comments: 24,
            location: {
               name: 'Sushi Bar Premium - Thảo Điền',
               lat: 10.8000,
               lon: 106.7333,
               address: '123 Thảo Điền, Quận 2, TP.HCM'
            }
         },
         {
            id: 'sub7',
            challengeId: '3',
            user: {
               id: 'user6',
               name: 'Lý Văn Phúc',
               avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/truyenthongVietNam_2.jpg'),
            caption: 'Kimchi Hàn Quốc tự làm - vị chua cay đặc trưng, tốt cho sức khỏe! 🇰🇷 #KhamPhaChauA',
            createdAt: '2024-01-17T09:20:00Z',
            likes: 98,
            comments: 15,
            location: {
               name: 'Nhà Hàng Hàn Quốc - Phú Nhuận',
               lat: 10.7947,
               lon: 106.6789,
               address: '456 Nguyễn Văn Trỗi, Quận Phú Nhuận, TP.HCM'
            }
         },
      ],
   },
   {
      id: '4',
      title: 'Món Ăn Xanh & Healthy',
      description: 'Chia sẻ những món ăn healthy với màu xanh lá tươi mới! Salad, smoothie bowl, hay các món chay ngon.',
      type: 'daily',
      hashtag: '#MonAnXanh',
      startDate: '2024-01-16',
      endDate: '2024-01-16',
      participants: 67,
      category: 'color',
      isActive: true,
      isJoined: false,
      coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
      reward: {
         title: '🥗 Voucher Healthy',
         description: 'Voucher tại các nhà hàng healthy food',
         value: '300.000 VNĐ'
      },
      submissions: [
         {
            id: 'sub8',
            challengeId: '4',
            user: {
               id: 'user7',
               name: 'Vũ Thị Lan',
               avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/healthy_1.jpg'),
            caption: 'Salad rau xanh tươi ngon với dầu olive và hạt chia! Rau củ organic, giàu vitamin 🥗 #MonAnXanh',
            createdAt: '2024-01-16T08:30:00Z',
            likes: 78,
            comments: 12,
            location: {
               name: 'Nhà Hàng Healthy - Quận 3',
               lat: 10.7829,
               lon: 106.6889,
               address: '789 Võ Văn Tần, Quận 3, TP.HCM'
            }
         },
         {
            id: 'sub9',
            challengeId: '4',
            user: {
               id: 'user8',
               name: 'Đặng Văn Hùng',
               avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/healthy_2.jpg'),
            caption: 'Smoothie bowl xanh lá với matcha và trái cây tươi! Ngon và bổ dưỡng 🥤 #MonAnXanh',
            createdAt: '2024-01-16T10:15:00Z',
            likes: 65,
            comments: 9,
            location: {
               name: 'Smoothie Bar - Quận 7',
               lat: 10.7326,
               lon: 106.7227,
               address: '123 Nguyễn Thị Thập, Quận 7, TP.HCM'
            }
         },
         {
            id: 'sub10',
            challengeId: '4',
            user: {
               id: 'user9',
               name: 'Trần Thị Hương',
               avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/healthy_3.jpg'),
            caption: 'Rau cải xoăn kale với nước ép táo xanh! Detox tự nhiên, tăng cường miễn dịch 🥬 #MonAnXanh',
            createdAt: '2024-01-16T12:00:00Z',
            likes: 42,
            comments: 7,
            location: {
               name: 'Juice Bar Organic - Quận 1',
               lat: 10.7769,
               lon: 106.7009,
               address: '456 Đồng Khởi, Quận 1, TP.HCM'
            }
         },
         {
            id: 'sub11',
            challengeId: '4',
            user: {
               id: 'user10',
               name: 'Nguyễn Văn Tú',
               avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/healthy_4.jpg'),
            caption: 'Bánh mì ngũ cốc nguyên hạt với rau mầm! Nhiều chất xơ, ít calo 🍞 #MonAnXanh',
            createdAt: '2024-01-16T14:30:00Z',
            likes: 38,
            comments: 5,
            location: {
               name: 'Tiệm Bánh Healthy - Quận 2',
               lat: 10.8000,
               lon: 106.7333,
               address: '789 Mai Chí Thọ, Quận 2, TP.HCM'
            }
         },
      ],
   },
   {
      id: '5',
      title: 'Phiêu Lưu Ẩm Thực Đường Phố',
      description: 'Khám phá và chia sẻ những món ăn đường phố ngon nhất! Từ bánh mì, phở, bún đến các món street food độc đáo.',
      type: 'weekly',
      hashtag: '#PhiêuLưuĐườngPhố',
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      participants: 189,
      category: 'location',
      isActive: true,
      isJoined: false,
      coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
      reward: {
         title: '🎯 Giải Đặc Biệt',
         description: 'Bộ quà tặng ẩm thực đường phố',
         value: '1.000.000 VNĐ'
      },
      submissions: [
         {
            id: 'sub12',
            challengeId: '5',
            user: {
               id: 'user11',
               name: 'Lê Văn Minh',
               avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/duongpho_1.jpg'),
            caption: 'Bánh mì thịt nướng đường phố - hương vị đặc trưng Sài Gòn! Thịt nướng thơm lừng, rau sống tươi 🥖 #PhiêuLưuĐườngPhố',
            createdAt: '2024-01-16T07:45:00Z',
            likes: 134,
            comments: 21,
            location: {
               name: 'Bánh Mì Thịt Nướng - Nguyễn Huệ',
               lat: 10.7769,
               lon: 106.7009,
               address: '123 Nguyễn Huệ, Quận 1, TP.HCM'
            }
         },
         {
            id: 'sub13',
            challengeId: '5',
            user: {
               id: 'user12',
               name: 'Phạm Thị Nga',
               avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/duongpho_2.jpg'),
            caption: 'Bún bò Huế đường phố - nước dùng đậm đà, bánh bún dai ngon! 🍜 #PhiêuLưuĐườngPhố',
            createdAt: '2024-01-16T11:20:00Z',
            likes: 98,
            comments: 16,
            location: {
               name: 'Bún Bò Huế - Lê Lợi',
               lat: 10.7769,
               lon: 106.7009,
               address: '456 Lê Lợi, Quận 1, TP.HCM'
            }
         },
         {
            id: 'sub14',
            challengeId: '5',
            user: {
               id: 'user13',
               name: 'Hoàng Văn Sơn',
               avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/duongpho_3.jpg'),
            caption: 'Chè đường phố - ngọt ngào, mát lạnh! Nhiều loại chè truyền thống 🍧 #PhiêuLưuĐườngPhố',
            createdAt: '2024-01-16T15:10:00Z',
            likes: 76,
            comments: 11,
            location: {
               name: 'Tiệm Chè Đường Phố - Bùi Viện',
               lat: 10.7769,
               lon: 106.7009,
               address: '789 Bùi Viện, Quận 1, TP.HCM'
            }
         },
         {
            id: 'sub15',
            challengeId: '5',
            user: {
               id: 'user14',
               name: 'Trần Văn Long',
               avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/duongpho_4.jpg'),
            caption: 'Bánh tráng nướng đường phố - giòn rụm, thơm ngon! 🥠 #PhiêuLưuĐườngPhố',
            createdAt: '2024-01-16T17:30:00Z',
            likes: 89,
            comments: 14,
            location: {
               name: 'Bánh Tráng Nướng - Võ Văn Tần',
               lat: 10.7829,
               lon: 106.6889,
               address: '123 Võ Văn Tần, Quận 3, TP.HCM'
            }
         },
      ],
   },
   {
      id: '6',
      title: 'Món Ăn Truyền Thống Việt Nam',
      description: 'Chia sẻ những món ăn truyền thống Việt Nam đặc trưng! Từ bắc vào nam, mỗi vùng miền có hương vị riêng.',
      type: 'weekly',
      hashtag: '#TruyềnThốngViệtNam',
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      participants: 312,
      category: 'cuisine',
      isActive: true,
      isJoined: false,
      coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
      reward: {
         title: '🏅 Giải Vàng',
         description: 'Chuyến du lịch khám phá ẩm thực 3 miền',
         value: '10.000.000 VNĐ'
      },
      submissions: [
         {
            id: 'sub16',
            challengeId: '6',
            user: {
               id: 'user15',
               name: 'Nguyễn Thị Hoa',
               avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/truyenthongVietNam_1.jpg'),
            caption: 'Phở bò Hà Nội truyền thống - nước dùng trong, bánh phở mỏng! Hương vị đặc trưng miền Bắc 🍜 #TruyềnThốngViệtNam',
            createdAt: '2024-01-16T09:00:00Z',
            likes: 167,
            comments: 28,
            location: {
               name: 'Phở Bò Hà Nội - Nguyễn Thị Minh Khai',
               lat: 10.762622,
               lon: 106.660172,
               address: '123 Nguyễn Thị Minh Khai, Quận 1, TP.HCM'
            }
         },
         {
            id: 'sub17',
            challengeId: '6',
            user: {
               id: 'user16',
               name: 'Lê Văn Đức',
               avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
            },
            image: require('../assets/images/challenges/truyenthongVietNam_2.jpg'),
            caption: 'Bánh chưng truyền thống - món ăn không thể thiếu trong dịp Tết! 🥟 #TruyềnThốngViệtNam',
            createdAt: '2024-01-16T13:15:00Z',
            likes: 145,
            comments: 22,
            location: {
               name: 'Tiệm Bánh Truyền Thống - Chợ Bến Thành',
               lat: 10.7720,
               lon: 106.6983,
               address: 'Chợ Bến Thành, Quận 1, TP.HCM'
            }
         },
      ],
   },
]

export const getActiveChallenges = () => {
   return mockChallenges.filter(challenge => challenge.isActive)
}

export const getDailyChallenges = () => {
   return mockChallenges.filter(challenge => challenge.type === 'daily' && challenge.isActive)
}

export const getWeeklyChallenges = () => {
   return mockChallenges.filter(challenge => challenge.type === 'weekly' && challenge.isActive)
}

export const getUserJoinedChallenges = () => {
   return mockChallenges.filter(challenge => challenge.isJoined)
} 