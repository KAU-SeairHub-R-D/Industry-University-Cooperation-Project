package com.seairhub.driver.src.main.myinfo

import android.os.Bundle
import android.view.View
import com.bumptech.glide.Glide
import com.bumptech.glide.RequestManager
import com.seairhub.driver.R
import com.seairhub.driver.config.BaseFragment
import com.seairhub.driver.databinding.FragmentMyInfoBinding

class MyInfoFragment : BaseFragment<FragmentMyInfoBinding>(FragmentMyInfoBinding::bind, R.layout.fragment_my_info) {
    lateinit var glideManager : RequestManager

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        glideManager = Glide.with(this)
    }
}