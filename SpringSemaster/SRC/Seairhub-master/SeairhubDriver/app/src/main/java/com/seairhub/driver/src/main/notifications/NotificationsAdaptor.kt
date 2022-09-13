package com.seairhub.driver.src.main.notifications

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.seairhub.driver.databinding.ItemNotificationBinding
import com.seairhub.driver.src.main.notifications.models.NotificationItemData

class NotificationsAdaptor(private val notificationItems : ArrayList<NotificationItemData>) : RecyclerView.Adapter<NotificationsAdaptor.NotificationsViewHolder>() {

    interface OnItemClickListener {
        fun onItemClick(view: View, position: Int)
    }

    lateinit var onItemClickListener : OnItemClickListener

    fun setItemClickListener(itemClickListener : OnItemClickListener) {
        this.onItemClickListener = itemClickListener
    }

    inner class NotificationsViewHolder(private val binding : ItemNotificationBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(data : NotificationItemData) {
            binding.source.text = data.source
            binding.title.text = data.title
            binding.body.text = data.body
            binding.time.text = data.time
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NotificationsViewHolder {
        val binding = ItemNotificationBinding.inflate(LayoutInflater.from(parent.context), parent, false)

        return NotificationsViewHolder(binding)
    }

    override fun onBindViewHolder(holder: NotificationsViewHolder, position: Int) {
        holder.bind(notificationItems[position])

        holder.itemView.setOnClickListener {
            onItemClickListener.onItemClick(it, position)
        }
    }

    override fun getItemCount(): Int {
        return notificationItems.size
    }
}