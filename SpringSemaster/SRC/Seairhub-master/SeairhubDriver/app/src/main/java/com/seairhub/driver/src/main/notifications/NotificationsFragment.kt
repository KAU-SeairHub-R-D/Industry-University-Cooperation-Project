package com.seairhub.driver.src.main.notifications

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.bumptech.glide.RequestManager
import com.seairhub.driver.R
import com.seairhub.driver.config.BaseFragment
import com.seairhub.driver.databinding.FragmentNotificationsBinding
import com.seairhub.driver.src.main.list.models.ListItemData
import com.seairhub.driver.src.main.notifications.models.NotificationItemData

class NotificationsFragment : BaseFragment<FragmentNotificationsBinding>(FragmentNotificationsBinding::bind, R.layout.fragment_notifications) {
    lateinit var glideManager : RequestManager
    private val notificationItems = ArrayList<NotificationItemData>()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        glideManager = Glide.with(this)

        set()
    }

    @SuppressLint("NotifyDataSetChanged")
    private fun set() {
        val adaptor = NotificationsAdaptor(notificationItems)
        val layoutManager = LinearLayoutManager(requireContext())
        layoutManager.orientation = LinearLayoutManager.VERTICAL
        binding.rv.layoutManager = layoutManager
        binding.rv.adapter = adaptor

        adaptor.setItemClickListener(object : NotificationsAdaptor.OnItemClickListener {
            override fun onItemClick(view: View, position: Int) {
                println("onClick : $position")
            }
        })

        notificationItems.add(NotificationItemData("운송\n업체", "제목1", "알림내용1", "10:22"))
        notificationItems.add(NotificationItemData("운송\n업체", "제목2", "알림내용2", "1일"))
        notificationItems.add(NotificationItemData("화주", "제목3", "알림내용3", "1일"))
        notificationItems.add(NotificationItemData("운송\n업체", "제목4", "알림내용4", "3일"))
        notificationItems.add(NotificationItemData("화주", "제목5", "알림내용5", "4일"))
        notificationItems.add(NotificationItemData("화주", "제목6", "알림내용6", "5일"))
        notificationItems.add(NotificationItemData("화주", "제목7", "알림내용7", "6일"))
        notificationItems.add(NotificationItemData("운송\n업체", "제목8", "알림내용8", "6일"))
        notificationItems.add(NotificationItemData("운송\n업체", "제목9", "알림내용9", "7일"))
        notificationItems.add(NotificationItemData("운송\n업체", "제목10", "알림내용10", "7일"))
        adaptor.notifyDataSetChanged()
    }
}