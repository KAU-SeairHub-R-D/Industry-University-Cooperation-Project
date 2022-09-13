package com.seairhub.driver.src.main.list

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.seairhub.driver.databinding.ItemListBinding
import com.seairhub.driver.src.main.list.models.ListItemData

class ListAdaptor(private val listItems : ArrayList<ListItemData>) : RecyclerView.Adapter<ListAdaptor.ListViewHolder>() {

    interface OnItemClickListener {
        fun onItemClick(view: View, position: Int)
    }

    lateinit var onItemClickListener : OnItemClickListener

    fun setItemClickListener(itemClickListener : OnItemClickListener) {
        this.onItemClickListener = itemClickListener
    }

    inner class ListViewHolder(private val binding : ItemListBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(data : ListItemData) {
            binding.date.text = data.date
            binding.location.text = data.location
            binding.owner.text = data.owner
            binding.state.text = data.state
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ListViewHolder {
        val binding = ItemListBinding.inflate(LayoutInflater.from(parent.context), parent, false)

        return ListViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ListViewHolder, position: Int) {
        holder.bind(listItems[position])

        holder.itemView.setOnClickListener {
            onItemClickListener.onItemClick(it, position)
        }
    }

    override fun getItemCount(): Int {
        return listItems.size
    }
}